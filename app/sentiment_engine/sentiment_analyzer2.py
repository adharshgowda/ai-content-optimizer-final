# sentiment_analyzer2.py (UPDATED FULL VERSION)
"""
Advanced sentiment_analyzer2.py

Upgraded with:
---------------------------------
1. Real social comment ingestion via SocialIngestor
2. Trend awareness using TrendFetcher
3. Google Sheets logging for sentiment results
4. Unified output for pipeline integration (generator → optimizer → metrics)
5. Strong fallbacks (HF → TextBlob)
6. Student-friendly readable structure
"""

import logging
from typing import List, Union, Dict

from textblob import TextBlob
# Groq AI for cloud-based sentiment (Replaces heavy HF models)
from groq import Groq
import os

HF_AVAILABLE = False
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Language detection
try:
    from langdetect import detect
    LANG_AVAILABLE = True
except:
    LANG_AVAILABLE = False

# New Integrations
from app.integrations.social_ingestor import SocialIngestor
from app.integrations.trend_fetcher import TrendFetcher
from app.integrations.sheets_connector import append_row

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Lazy-loaded HF models
_senti_model = None
_emotion_model = None


# ------------------------------------------------------
# Groq-based Sentiment & Emotion (Cloud Optimized)
# ------------------------------------------------------
def analyze_with_ai(text: str) -> Dict:
    """Uses Groq to perform high-quality sentiment and emotion analysis without heavy local models."""
    if not GROQ_API_KEY:
        return fallback_sentiment(text)
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"""
        Analyze the sentiment and emotions of this text: "{text}"
        Return ONLY valid JSON in this format:
        {{
            "label": "POSITIVE/NEGATIVE/NEUTRAL",
            "score": 0.0 to 1.0,
            "emotions": {{"joy": 0.0, "anger": 0.0, "surprise": 0.0, "sadness": 0.0, "fear": 0.0}}
        }}
        """
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        return data
    except Exception as e:
        logger.warning(f"Groq Sentiment failed: {e}")
        return fallback_sentiment(text)

import json


# ------------------------------------------------------
# Utilities
# ------------------------------------------------------
def detect_language(text: str) -> str:
    if not LANG_AVAILABLE:
        return "unknown"
    try:
        return detect(text)
    except Exception:
        return "unknown"


def fallback_sentiment(text: str) -> Dict:
    polarity = TextBlob(text).sentiment.polarity
    if polarity >= 0.05:
        label = "POSITIVE"
    elif polarity <= -0.05:
        label = "NEGATIVE"
    else:
        label = "NEUTRAL"

    return {
        "label": label,
        "score": abs(polarity),
        "polarity": polarity
    }


def simplify_emotion_output(raw_output: List[Dict]) -> Dict:
    return {x["label"]: float(x["score"]) for x in raw_output}


# ------------------------------------------------------
# NEW FEATURE: Analyze sentiment of *live social comments*
# ------------------------------------------------------
def analyze_post_comments(post_id: str) -> Dict:
    """
    Fetches comments using SocialIngestor → scores them →
    returns aggregated sentiment & toxicity.
    """
    ingestor = SocialIngestor()
    comments = ingestor.fetch_post_comments(post_id)

    if not comments:
        return {
            "post_id": post_id,
            "avg_sentiment": 0.5,
            "avg_polarity": 0.0,
            "avg_toxicity": 0.0,
            "labels": {},
            "samples": []
        }

    results = analyze_sentiment(comments)
    labels = {"POSITIVE": 0, "NEGATIVE": 0, "NEUTRAL": 0}

    for r in results:
        labels[r["sentiment_label"]] += 1

    avg_sent = sum(r["sentiment_score"] for r in results) / len(results)
    avg_pol = sum(r["polarity"] for r in results) / len(results)

    # Toxicity (from emotions if available)
    avg_toxic = 0.0
    for r in results:
        if "anger" in r["emotions"]:
            avg_toxic += r["emotions"].get("anger", 0)
    avg_toxic /= len(results)

    # Log to Google Sheets
    try:
        append_row("comment_sentiment", [
            post_id,
            avg_sent,
            avg_pol,
            avg_toxic,
            labels
        ])
    except:
        pass

    return {
        "post_id": post_id,
        "avg_sentiment": round(avg_sent, 4),
        "avg_polarity": round(avg_pol, 4),
        "avg_toxicity": round(avg_toxic, 4),
        "labels": labels,
        "samples": results
    }


# ------------------------------------------------------
# MASTER FUNCTION — sentiment + emotion + trend awareness
# ------------------------------------------------------
def analyze_sentiment(texts: Union[str, List[str]]) -> List[Dict]:
    """
    Returns list of:
    {
        "text": ...,
        "sentiment_label": ...,
        "sentiment_score": ...,
        "polarity": ...,
        "emotions": {joy: 0.2, ...},
        "language": ...,
        "trend_score": ...   <-- NEW
    }
    """

    if isinstance(texts, str):
        texts = [texts]

    global _senti_model, _emotion_model

    # Load models once
    if HF_AVAILABLE:
        if _senti_model is None:
            _senti_model = _init_sentiment_model()
        if _emotion_model is None:
            _emotion_model = _init_emotion_model()

    trend_engine = TrendFetcher()
    results = []

    for text in texts:
        lang = detect_language(text)

        # AI Analysis (Cloud-ready)
        ai_data = analyze_with_ai(text)
        label = ai_data.get("label", "NEUTRAL")
        score = ai_data.get("score", 0.5)
        emotions = ai_data.get("emotions", {})
        polarity = TextBlob(text).sentiment.polarity

        if label.startswith("NEG"):
            norm_score = 1 - score
        else:
            norm_score = score

        # TREND SCORE
        trend_score = trend_engine.get_combined_trend_score(text)

        entry = {
            "text": text,
            "sentiment_label": label,
            "sentiment_score": round(norm_score, 4),
            "polarity": polarity,
            "emotions": emotions,
            "language": lang,
            "trend_score": trend_score
        }

        # Save to Google Sheets
        try:
            append_row("sentiment_results", [
                text[:80] + "...",
                label,
                norm_score,
                polarity,
                trend_score
            ])
        except:
            pass

        results.append(entry)

    return results


# ------------------------------------------------------
# DataFrame helper
# ------------------------------------------------------
def analyze_from_dataframe(df, text_column: str):
    if text_column not in df.columns:
        raise ValueError(f"Column '{text_column}' not found in DataFrame.")

    out = analyze_sentiment(df[text_column].tolist())

    df["sentiment_label"] = [r["sentiment_label"] for r in out]
    df["sentiment_score"] = [r["sentiment_score"] for r in out]
    df["polarity"] = [r["polarity"] for r in out]
    df["emotions"] = [r["emotions"] for r in out]
    df["language"] = [r["language"] for r in out]
    df["trend_score"] = [r["trend_score"] for r in out]

    return df


# ------------------------------------------------------
# Test Run
# ------------------------------------------------------
if __name__ == "__main__":
    sample = [
        "I absolutely love this AI tool!",
        "This is frustrating and disappointing.",
        "Not sure if this is good or bad 😂"
    ]

    out = analyze_sentiment(sample)
    for r in out:
        print(r)
