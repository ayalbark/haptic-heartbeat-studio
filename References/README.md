# Node-RED + Wearable Reference

## Files

| File | Description |
|------|-------------|
| `Node-RED-Integrated.json` | Flow that accepts config from the React app. **Use this** for the full integration. |
| `Node-Red Reference.json` | Original flow (hardcoded AAPL). |
| `Haptic Reference.py` | Wearable MicroPython code – subscribes to MQTT and controls 6 motors. |
| `MotorTest.py` | **Single-motor test** – use this to verify Node-RED → MQTT is working before testing the full setup. |

## Setup: React ↔ Node-RED Integration

### 1. Import the integrated flow in Node-RED

1. Open Node-RED (usually http://localhost:1880)
2. **Delete any old flow** (HTTP Request → Stock to Haptic) to avoid conflicts
3. Menu → Import → Clipboard
4. Paste the contents of `Node-RED-Integrated.json`
5. Choose **"Replace"** to overwrite the tab (or add to new tab)
6. **Configure the HTTP Request node**: Double-click "Get Stock from Finnhub" → the URL field should be empty (it uses `msg.url` from the previous node). If your Node-RED version requires a URL, use `{{{msg.url}}}` in expression mode.
7. Deploy (red button)

### 2. Enable CORS (so the React app can call Node-RED)

Edit your Node-RED `settings.js` (often `~/.node-red/settings.js`):

```javascript
httpNodeCors: {
    origin: "http://localhost:8080",  // React dev server
    credentials: true
},
```

Restart Node-RED after changing settings.

### 3. Finnhub API key

The key is stored in `.env` as `FINNHUB_TOKEN`. To run Node-RED with it loaded:

```bash
./scripts/start-nodered.sh
```

Or run Node-RED with the env var set manually: `FINNHUB_TOKEN=your_key node-red`

### 4. Run the React app

```bash
npm run dev
```

The app runs at http://localhost:8080.

## Activate vs Test Pattern

| Action | What it does |
|--------|--------------|
| **Activate** | Stores your config in Node-RED. The stock fetch runs every 30s (configurable in the inject node), fetches from Finnhub, and publishes to MQTT. You feel live stock updates. |
| **Test Pattern** | Sends one immediate message to MQTT using your current slider/pattern settings. No config storage, no stock fetch. Good for verifying intensity/pattern without waiting. |

Both publish to the same topic, so if you press Test Pattern while Activate is running, you may get two buzzes close together. Use Test Pattern to verify settings before or after activating.

## Flow: How the ticker gets into Node-RED

1. User enters a ticker (e.g. AAPL, TSLA) in the React rule builder.
2. User clicks **Activate Both Rules**.
3. React POSTs `PresetConfig` to `http://localhost:1880/haptic/activate`.
4. Node-RED stores the config in **global context**.
5. The stock fetch loop (every 30s) reads the ticker from the stored config.

**Order matters:** Deploy Node-RED first, then click **Activate Both Rules** in the React app. Each deploy clears stored config.

**Debug:** Open http://localhost:1880/haptic/status in your browser to see if config is stored. If `config` is null, the Activate request didn't reach Node-RED (check CORS, React app URL).

## Single-motor test (`MotorTest.py`)

Use this to verify the Node-RED → MQTT pipeline before testing all motors:

1. Flash `MotorTest.py` to your Pico (or run it instead of `Haptic Reference.py`).
2. Run Node-RED with the integrated flow and start the React app.
3. In the React app: enter a ticker (e.g. TSLA), click **Activate**, or click **Test Pattern**.
4. When Node-RED publishes to `multisense/stock/data`, the single motor (GPIO 13) should buzz.
5. Serial output will show the raw MQTT message so you can confirm it's coming from Node-RED.
6. Node-RED fetches from Finnhub using that ticker.
7. Node-RED publishes to MQTT topic `multisense/stock/data`.
8. The wearable receives the message and drives the motors.

**Changing the ticker in the UI and clicking Activate again updates the config immediately** – no need to edit Node-RED.
