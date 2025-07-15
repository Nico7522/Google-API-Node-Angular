import fs from "fs";
import path from "path";

const TOKENS_FILE = path.join(__dirname, "../tokens.json");

function readTokensFile(): Record<string, any> {
  try {
    if (!fs.existsSync(TOKENS_FILE)) {
      fs.writeFileSync(TOKENS_FILE, "{}", "utf-8");
    }
    const data = fs.readFileSync(TOKENS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading tokens file:", err);
    return {};
  }
}

function writeTokensFile(tokens: Record<string, any>) {
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing tokens file:", err);
  }
}

export function getTokens(): Record<string, any> {
  return readTokensFile();
}

export function setToken(key: string, value: any) {
  const tokens = readTokensFile();
  tokens[key] = value;
  writeTokensFile(tokens);
}

export function removeToken(key: string) {
  const tokens = readTokensFile();
  delete tokens[key];
  writeTokensFile(tokens);
}
