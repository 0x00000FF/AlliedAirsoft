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
    
    let tags = [];
    let currentShowingItems = [];
    
    const onCategoryFilterToggle = function (ev) {
        alert("곧 지원됩니다!");
    };

    const refreshView = function () {
        $(".items").innerHTML = "";
        currentShowingItems
            .randomize()
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
            img.src = i.icon ?? "img/mullu.jpg";

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

            category.items.forEach(item => items.push(item));
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
    });
})();