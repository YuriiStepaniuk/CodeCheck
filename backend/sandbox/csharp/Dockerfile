# Use the SDK image (required for the script runner)
FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# 1. Install dotnet-script globally
RUN dotnet tool install -g dotnet-script

# 2. Add the tools path to the environment so you can run "dotnet-script" directly
ENV PATH="$PATH:/root/.dotnet/tools"

# 3. (Optional) Warm up the runner to speed up first execution
RUN echo 'Console.WriteLine("Hello");' > warmup.csx && dotnet-script warmup.csx && rm warmup.csx

# The container will stay alive waiting for commands (or you can use it ephemerally)
CMD ["tail", "-f", "/dev/null"]