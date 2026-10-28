using HogAgent;
using HogAgent.Models;
using HogAgent.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateDefaultBuilder(args)
    .UseWindowsService(options =>
    {
        options.ServiceName = "HogSessionAgent";
    })
    .ConfigureServices((hostContext, services) =>
    {
        var config = hostContext.Configuration.GetSection("HogAgent").Get<AgentConfig>() ?? new AgentConfig();
        services.AddSingleton(config);

        services.AddHttpClient<HogApiClient>();
        services.AddSingleton<SessionCountdownService>();
        services.AddHostedService<Worker>();
    });

var host = builder.Build();
await host.RunAsync();
