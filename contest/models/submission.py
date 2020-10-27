class Submission:
  def __init__(self, data):
    # Implicit definition of properties which can be error prone.
    #   Python linter will complain about access properties of `Submission` 
    #   because they are not explicitly defined
    
    # NOTE: Right now the implementation of Submission object is redundant storing
    #       an _id (ObjectID) property and id (String) for the same value.
    self.__dict__ = data