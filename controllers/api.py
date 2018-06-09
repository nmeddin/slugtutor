# These code snippets use an open-source library. http://unirest.io/python
# response = unirest.get("https://healthruwords.p.mashape.com/v1/quotes/?id=731&maxR=1&size=medium&t=Wisdom",
#   headers={
#     "X-Mashape-Key": "NN569DEEiWmshBASQyyNkfCW1ybEp1Saa5Djsndgm5A62xkHEY",
#     "Accept": "application/json"
#   }
# )

@auth.requires_signature()
def get_initial_user_info():
	print(auth.user.id)
	posts = []
	for row in db(db.post.created_by==auth.user.id).select(orderby=~db.post.day_of):
		print(auth.user.first_name)
		#print(row.image_url)
		posts.append(row)
		
	return response.json(dict(posts=posts,curr_user=auth.user.id))

def get_classes():
	posts = []
	for row in db(db.post).select(db.post.classnum==request.vars.search):
		#print(row)
		posts.append(row)
	return response.json(dict(posts=posts))


def get_search():
	posts = []
	for row in db(db.post.classnum==request.vars.search).select(db.post.ALL):
		#print(row)
		posts.append(row)
	return response.json(dict(posts=posts))

def add_post():
    """Adds a tutoring post."""
    form = SQLFORM(db.post)
    if form.process().accepted:
        session.flash = T("Session posted.")
        redirect(URL('default','index'))
    elif form.errors:
        session.flash = T('Please correct the info')
    return dict(form=form)