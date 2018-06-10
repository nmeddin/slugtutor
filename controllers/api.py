# These code snippets use an open-source library. http://unirest.io/python
# response = unirest.get("https://healthruwords.p.mashape.com/v1/quotes/?id=731&maxR=1&size=medium&t=Wisdom",
#   headers={
#     "X-Mashape-Key": "NN569DEEiWmshBASQyyNkfCW1ybEp1Saa5Djsndgm5A62xkHEY",
#     "Accept": "application/json"
#   }
# )

@auth.requires_signature()
def get_initial_user_info():
	posts = []
	for row in db(db.post.created_by==auth.user.id).select(orderby=~db.post.day_of):
		row.update_record(leader_name=auth.user.first_name)
		row.update_record(leader_email=auth.user.email)
		#print(row.image_url)
		posts.append(row)
		
	return response.json(dict(posts=posts,curr_user=auth.user.id))

def get_initial_class_info():
	departments = []
	for row in db().select(db.classes.department_id, distinct=True):
		print(row.department_id)
		departments.append(row.department_id)

		
	return response.json(dict(departments=departments))


def get_users():
	user_list = []
	u_id = auth.user_id
	# user_email = auth.user.email
	rows = db().select(orderby=db.auth_user.id != u_id)
	for i,r in enumerate(rows):
		m = dict(
			id=r.id,
			first_name=r.first_name,
			last_name=r.last_name,
			email = r.email
		)
		user_list.append(m)
	return response.json(dict(user_list=user_list))


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

def get_demand():
	row_info = {}
#	search = request.vars.search.split()
	query = (db.classes.class_id==request.vars.search) & (db.classes.department_id==request.vars.dept)
	for row in db(query).select():
		print('we matched something')
		row_info = {'title' : row.title, 'department' : row.department, 'class_id' : row.class_id}
		
	return response.json(dict(row_info=row_info))


#@auth.requires_signature()
#def set_price():
#	row = db(db.user_images.image_url == request.vars.image).select().first()
#	row.update_record(image_price = request.vars.new_price)

def update_post():
	for row in db(db.post.created_by==auth.user.id).select(orderby=~db.post.day_of):
		#print(row)
		row.update_record(leader_name=request.vars.first_name)
		row.update_record(email=request.vars.email)
pass
		



def add_post():
    """Adds a tutoring post."""
    form = SQLFORM(db.post)
    if form.process().accepted:
        session.flash = T("Session posted.")
        redirect(URL('default','index'))
    elif form.errors:
        session.flash = T('Please correct the info')
    return dict(form=form)