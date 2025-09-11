const cache = new Map<string, string>();


export async function summarizeRisk({ amount, currency, score, reasons, routed, provider }: any) {
    const promptKey = JSON.stringify({ amount, currency, score, reasons, routed, provider });
    if (cache.has(promptKey)) return cache.get(promptKey)!;


    // If an API key is present we *could* call OpenAI. For the purposes of this exercise we keep
    // a safe fallback. If you set OPENAI_API_KEY in .env, replace the fallback block below with
    // a fetch to the OpenAI Chat Completions endpoint.


    const routedText = routed ? `The payment was routed to ${provider}.` : 'The payment was blocked due to high risk.';
    const explanation = `Risk score ${score}. ${routedText} Reasons: ${reasons.join(', ') || 'none'}.`;


    cache.set(promptKey, explanation);
    return explanation;
}