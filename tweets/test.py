import json
import codecs
from datetime import datetime

# Function to extract and clean tweet details
def extract_tweet_details(tweet):
    # Decode Unicode escape sequences in the full text
    full_text_raw = tweet.get('legacy', {}).get('full_text', None)
    full_text_clean = codecs.decode(full_text_raw, 'unicode_escape')

    tweet_details = {}
    tweet_details['tweet_id'] = tweet.get('rest_id')  # Store the tweet ID
    tweet_details['full_text'] = full_text_clean
    tweet_details['created_at'] = tweet.get('legacy', {}).get('created_at', None)
    
    # Extract images
    tweet_details['media'] = [
        media.get('media_url_https') for media in tweet.get('legacy', {}).get('extended_entities', {}).get('media', [])
        if media.get('type') == 'photo'
    ]
    
    # Extract the highest resolution video link (mp4)
    video_links = []
    for media in tweet.get('legacy', {}).get('extended_entities', {}).get('media', []):
        if media.get('type') == 'video':
            # Sort by bitrate to get the highest quality video
            highest_bitrate = max(media.get('video_info', {}).get('variants', []), key=lambda x: x.get('bitrate', 0))
            if highest_bitrate.get('content_type') == 'video/mp4':
                video_links.append(highest_bitrate.get('url'))
    
    tweet_details['video_links'] = video_links
    tweet_details['tweet_link'] = f"https://twitter.com/i/web/status/{tweet.get('rest_id')}"
    
    return tweet_details

# Load the existing tweets from the JSON file
output_file_path = 'tweets_sorted_no_duplicates.json'

try:
    with open(output_file_path, 'r') as file:
        existing_tweets = json.load(file)
except FileNotFoundError:
    # If the file doesn't exist, start with an empty list
    existing_tweets = []

# Track seen tweet IDs and texts from the existing data
seen_tweet_ids = {tweet['tweet_id'] for tweet in existing_tweets}
seen_texts = {tweet['full_text'] for tweet in existing_tweets}

# Load the new tweets from the next page response
input_file_path = 'response_next_page.json'

with open(input_file_path, 'r') as file:
    data = json.load(file)

# Extracting all tweets details with the updated function
for entry in data.get('data', {}).get('user', {}).get('result', {}).get('timeline_v2', {}).get('timeline', {}).get('instructions', []):
    if entry.get('type') == 'TimelineAddEntries':
        for item in entry.get('entries', []):
            tweet = item.get('content', {}).get('itemContent', {}).get('tweet_results', {}).get('result', {})
            if tweet:
                tweet_details = extract_tweet_details(tweet)
                
                # Check if the tweet is a duplicate
                if tweet_details['tweet_id'] not in seen_tweet_ids and tweet_details['full_text'] not in seen_texts:
                    # Add tweet to the existing tweets and mark it as seen
                    seen_tweet_ids.add(tweet_details['tweet_id'])
                    seen_texts.add(tweet_details['full_text'])
                    
                    # Convert the created_at field to a datetime object
                    tweet_details['created_at_datetime'] = datetime.strptime(tweet_details['created_at'], '%a %b %d %H:%M:%S %z %Y')
                    existing_tweets.append(tweet_details)

# Ensure all tweets have the `created_at_datetime` field before sorting
for tweet in existing_tweets:
    if 'created_at_datetime' not in tweet:
        tweet['created_at_datetime'] = datetime.strptime(tweet['created_at'], '%a %b %d %H:%M:%S %z %Y')

# Sort tweets by date (newest first)
tweets_sorted = sorted(existing_tweets, key=lambda x: x['created_at_datetime'], reverse=True)

# Remove the datetime object before writing to JSON
for tweet in tweets_sorted:
    del tweet['created_at_datetime']

# Writing the updated tweets to the JSON file (upsert functionality)
with open(output_file_path, 'w') as output_file:
    json.dump(tweets_sorted, output_file, indent=4)
