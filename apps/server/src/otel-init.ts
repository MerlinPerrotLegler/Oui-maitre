// Optional OpenTelemetry init; enabled when OTEL_ENABLED=1
if (process.env.OTEL_ENABLED === '1') {
  // Dynamically import to avoid hard dependency at runtime
  import('@opentelemetry/sdk-node').then(async ({ NodeSDK }) => {
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const exporter = new OTLPTraceExporter({});
    const sdk = new NodeSDK({
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });
    await sdk.start();
  });
}

