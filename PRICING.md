# 💰 Pricing & Costs

This application uses two paid API services. Here's a breakdown of the costs:

## 📊 Cost Overview

### 1. ElevenLabs API (Voice Cloning & Synthesis)

ElevenLabs offers different subscription plans:

#### Free Tier (Good for Testing)
- **Cost**: FREE
- **Includes**:
  - 10,000 characters per month
  - 3 custom voices
  - Basic voice cloning

#### Starter Plan
- **Cost**: $5/month
- **Includes**:
  - 30,000 characters per month
  - 10 custom voices
  - Instant voice cloning
  - Commercial license

#### Creator Plan (Recommended for Personal Use)
- **Cost**: $22/month
- **Includes**:
  - 100,000 characters per month
  - 30 custom voices
  - 2 hours of audio generation
  - Professional voice cloning
  - Project access

#### Pro Plan
- **Cost**: $99/month
- **Includes**:
  - 500,000 characters per month
  - 160 custom voices
  - More features

#### Higher Plans
- Scale: $330/month
- Business: $1,320/month

**Note**: Character count refers to text-to-speech synthesis. Voice cloning itself is included in most plans.

**Official Pricing**: https://elevenlabs.io/pricing

---

### 2. Google Gemini API (AI Conversation)

Google Gemini offers competitive pricing with a free tier:

#### Free Tier (AI Studio)
- **Cost**: FREE
- **Limits**:
  - 60 requests per minute (RPM)
  - 1,500 requests per day (RPD)
  - Good for development and testing

#### Paid Tier (Vertex AI)
- **Cost**: Pay-as-you-go
- **Gemini 2.5 Pro Pricing**:
  - **Input tokens**: 
    - ≤200K tokens: $1.25 per 1M tokens
    - >200K tokens: $2.50 per 1M tokens
  - **Output tokens**:
    - ≤200K tokens: $10 per 1M tokens
    - >200K tokens: $15 per 1M tokens

**Example Cost Calculation**:
- Average conversation: ~500 tokens input + ~300 tokens output
- 1,000 conversations ≈ $0.875 (input) + $3.00 (output) = **~$3.88**

**Official Pricing**: https://ai.google.dev/pricing

---

## 💡 Cost Optimization Tips

### 1. Start with Free Tiers
- Use ElevenLabs free tier (10K characters/month) for testing
- Use Google Gemini free tier (1,500 requests/day) for development

### 2. Monitor Usage
- Track API calls and character usage
- Set up billing alerts
- Use rate limiting to prevent unexpected costs

### 3. Optimize Text Length
- Keep AI responses concise when possible
- Use shorter prompts
- Cache frequently used responses

### 4. Choose the Right Plan
- **For personal/hobby use**: ElevenLabs Starter ($5) + Gemini Free = **$5/month**
- **For moderate use**: ElevenLabs Creator ($22) + Gemini Free = **$22/month**
- **For heavy use**: Calculate based on your expected volume

---

## 📈 Estimated Monthly Costs

### Scenario 1: Light Usage (Personal)
- **Usage**: 50 conversations/day, ~500 chars each
- **ElevenLabs**: Free tier (10K chars/month) - **FREE**
- **Gemini**: Free tier - **FREE**
- **Total**: **$0/month** ✅

### Scenario 2: Moderate Usage
- **Usage**: 200 conversations/day, ~1,000 chars each
- **ElevenLabs**: Starter plan - **$5/month**
- **Gemini**: Free tier - **FREE**
- **Total**: **$5/month**

### Scenario 3: Heavy Usage
- **Usage**: 1,000 conversations/day, ~2,000 chars each
- **ElevenLabs**: Creator plan - **$22/month**
- **Gemini**: ~$11/month (estimated)
- **Total**: **~$33/month**

---

## 🚨 Important Notes

1. **Free Tiers Have Limits**: Make sure to monitor usage to avoid unexpected charges
2. **Billing Alerts**: Set up alerts in both services to track spending
3. **Character Count**: ElevenLabs counts characters in the text you synthesize, not input audio
4. **API Key Security**: Never commit API keys to version control
5. **Pricing Changes**: API pricing may change, check official websites for latest rates

---

## 🔗 Resources

- [ElevenLabs Pricing](https://elevenlabs.io/pricing)
- [Google Gemini Pricing](https://ai.google.dev/pricing)
- [ElevenLabs Documentation](https://docs.elevenlabs.io/)
- [Google AI Studio](https://makersuite.google.com/)

---

## ❓ FAQ

**Q: Can I use this completely free?**
A: Yes, for light testing! Both services offer free tiers, but with usage limits.

**Q: What happens if I exceed free tier limits?**
A: You'll need to upgrade to a paid plan. Make sure to set up billing alerts.

**Q: Which plan should I start with?**
A: Start with free tiers for testing. Upgrade to ElevenLabs Starter ($5) if you need more voice synthesis.

**Q: How do I monitor my usage?**
A: Check your dashboard in both ElevenLabs and Google AI Studio for usage statistics.

