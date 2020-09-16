class Team:
  def __init__(self, id, username, password, name, submissions=[]):
    self.id = id
    self.username = username
    self.password = password
    self.name = name
    self.submissions = submissions
    
  @staticmethod
  def fromObj(obj):
    submissions = []
    if 'submissions' in obj:
      submissions = obj['submissions']

    return Team(obj['_id'], obj['username'], obj['password'], obj['name'], submissions=submissions)