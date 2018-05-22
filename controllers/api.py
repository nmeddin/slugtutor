# These code snippets use an open-source library. http://unirest.io/python
response = unirest.get("https://healthruwords.p.mashape.com/v1/quotes/?id=731&maxR=1&size=medium&t=Wisdom",
  headers={
    "X-Mashape-Key": "NN569DEEiWmshBASQyyNkfCW1ybEp1Saa5Djsndgm5A62xkHEY",
    "Accept": "application/json"
  }
)