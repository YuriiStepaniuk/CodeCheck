FROM mcr.microsoft.com/dotnet/sdk:7.0
WORKDIR /app
COPY runner.cs .
RUN dotnet new console -n RunnerApp -o . --force
CMD ["dotnet", "run", "--project", "."]