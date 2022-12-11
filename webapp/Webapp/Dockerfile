FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Webapp/Webapp.csproj", "Webapp/"]
RUN dotnet restore "Webapp/Webapp.csproj"
COPY . .
WORKDIR "/src/Webapp"
RUN dotnet build "Webapp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Webapp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Webapp.dll"]
