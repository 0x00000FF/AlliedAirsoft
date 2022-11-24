(function () {
    const $  = document.querySelector.bind(document);

    // https://stackoverflow.com/questions/2450954
    Array.prototype.randomize = function () {
        const length = this.length;
        
        for (let i = 0; i < length; ++i) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }

        return this;
    };


    const items = [];
    
    let filterList = [];
    let searchQuery = "";

    let tags = [];
    let currentShowingItems = [];
    
    const onCategoryFilterToggle = function (ev) {
        const chosen = ev.target;
        const category = chosen.dataset.id

        if (filterList.includes(category)) {
            chosen.style.backgroundColor = "#ffffff";
            filterList = [...filterList.filter(f => f !== category)];
        } else {
            chosen.style.backgroundColor = "#cccccc";
            filterList.push(category);
        }

        refreshView();
    };

    const searchCallback = function (ev) {
        searchQuery = ev.target.value;
        refreshView();
    };

    const refreshView = function () {
        $(".items").innerHTML = "";
        currentShowingItems = [...items];
        currentShowingItems
            .randomize()
            .filter(i => filterList.length === 0 ? true : filterList.includes(i.category))
            .filter(i => i.name.includes(searchQuery))
            .forEach(i => {
            const it = document.createElement("div");
            it.className = "item-block";
            it.dataset.url = i.url;
            it.onclick = function () {
                if (it.dataset.url)
                    window.open(it.dataset.url);
            }

            const img = document.createElement("img");
            img.className = "item-icon";
            img.src = i.icon ?? "res/mullu.jpg";

            const itIn = document.createElement("div");
            itIn.className = "item-description";

            const name = document.createElement("h3");
            name.innerText = i.name;

            const tagList = document.createElement("ul");
            tagList.className = "item-tag-list";

            i.tags.forEach(t => {
                const tli = document.createElement("li");
                
                tli.dataset.tagname = t;
                tli.innerText = t;

                tagList.append(tli);
            });

            itIn.append(name);
            itIn.append(tagList);

            it.append(img);
            it.append(itIn);

            $(".items").append(it);
        });
    }

    const completeLoad = function (json) {
        const result = typeof(json) === "string" ? 
                        JSON.parse(json) : json;

        result.forEach(category => {
            const li = document.createElement("li");
            
            li.dataset.id = category.id;
            li.innerText = category.title;
            li.onclick = onCategoryFilterToggle;

            $(".category").append(li);

            category.items.forEach(item => {
                item.category = category.id;
                items.push(item)
            });
        });

        currentShowingItems = items;
        tags = currentShowingItems.map(i => i.tags);

        refreshView();

        $(".loading-overlay").dataset.hidden = true;
    }

    const reloadItems = function () {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => completeLoad(xhr.responseText);
        xhr.open("GET", "config.json");

        xhr.send();
    };


    window.addEventListener("load", function () {
        reloadItems();

        $(".search-box").addEventListener("change", searchCallback);
    });
})();