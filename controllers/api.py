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

	return response.json(dict(posts=posts,curr_user=auth.user.id,curr_email=auth.user.email))

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


# def get_classes():
# 	posts = []
# 	for row in db(db.post).select(db.post.classnum==request.vars.search):
# 		#print(row)
# 		posts.append(row)
# 	return response.json(dict(posts=posts))


def get_search():
	posts = []
	for row in db(db.post.classnum==request.vars.search).select():
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

def join_post():
	print('this posting: ')
	print(request.vars.posting)
	print(' this user: ')
	print(auth.user_id)
	db.ownership.insert(post=request.vars.posting, student=auth.user_id)
pass

def delete_post():
	print('this posting: ')
	print(request.vars.posting)
	print(' this user: ')
	print(auth.user_id)
	row = db(db.post.id==request.vars.posting).select().first()
	row.delete_record()
	
	
	pass

#@auth.requires_signature()
#def get_initial_user_info():
#	posts = []
#	for row in db(db.post.created_by==auth.user.id).select(orderby=~db.post.day_of):
#		row.update_record(leader_name=auth.user.first_name)
#		row.update_record(leader_email=auth.user.email)
#		#print(row.image_url)
#		posts.append(row)
#
#	return response.json(dict(posts=posts,curr_user=auth.user.id,curr_email=auth.user.email))

"""
db((db.person.id == db.ownership.person) &
                            (db.thing.id == db.ownership.thing))
"""

def get_joined_posts():
	print('This user called get joined posts:')
	print(auth.user.id)
	results = []
	for row in db((db.post.id==db.ownership.post)&(db.ownership.student==auth.user_id)).select():
		print('printing post this student joined')
		print(row.post)
		print('printing ownership student')
		print(row.ownership.student)
		results.append(row.post)
	return response.json(dict(results=results))

def fetch_rating():
	t_email = request.vars.tutor_email
	rating = 0;
	for row in db(db.tutor.email==t_email).select():
		rating = row.rating

	print(rating)
	return response.json(rating=rating)

def add_post():
    """Adds a tutoring post."""
    form = SQLFORM(db.post)
    if form.process().accepted:
        session.flash = T("Session posted.")
        redirect(URL('default','index'))
    elif form.errors:
        session.flash = T('Please correct the info')
    return dict(form=form)
