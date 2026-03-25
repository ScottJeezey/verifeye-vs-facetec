# VerifEye vs FaceTec Comparison Tool

Side-by-side face verification comparison tool showing VerifEye and FaceTec demos with timing and pass/fail tracking.

## Features

- ✅ Split-screen iframe comparison
- ✅ Real-time timer for each platform
- ✅ Pass/fail result tracking
- ✅ Comparison summary with speed metrics
- ✅ Sequential testing flow (VerifEye → FaceTec)
- ✅ Highlights robustness differences

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Vercel Dashboard

1. Push this directory to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Vercel will auto-detect Next.js and deploy

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## How It Works

1. **User starts VerifEye test** - Timer begins automatically
2. **User completes verification** - Marks pass/fail
3. **User starts FaceTec test** - Second timer begins
4. **User completes verification** - Marks pass/fail
5. **Comparison summary appears** - Shows speed, results, winner

## Key Metrics Tracked

- ⏱️ **Elapsed Time** - Millisecond precision
- ✅/❌ **Pass/Fail** - Did verification succeed?
- 🏆 **Winner** - Fastest successful verification
- 📊 **Speed Multiplier** - How much faster was the winner?

## Future Enhancements (V2)

- [ ] Mobile responsive design
- [ ] Configurable competitor selection
- [ ] Step count tracking
- [ ] Anonymous usage analytics
- [ ] Social sharing of results
- [ ] Screenshot capture of failures
- [ ] Automatic pass/fail detection (if possible)

## Built With

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
