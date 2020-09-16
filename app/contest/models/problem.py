import os, copy

class Problem:
  def __init__(self, data):
    # Implicit definition of properties which can be error prone.
    #   Python linter will complain about access properties of `Problem` 
    #   because they are not explicitly defined
    self.__dict__ = data

    self.tests = []

    testdata_dir = f"testdata/{self.id}"
    for filename in os.listdir(testdata_dir):
      # If `in` file.
      if filename[-3:] == ".in":
        # `ans` file for `in` file.
        ans_file = f"{testdata_dir}/{filename[:-3]}.ans"
        # If `ans` file exists
        if os.path.isfile(ans_file):
          # Test metadata
          self.tests.append({
            'in_file': f"{testdata_dir}/{filename}",
            'ans_file': ans_file,
            'status': 'pending'
          })

  # Used when making Submission object
  def copy_tests(self):
    return copy.deepcopy(self.tests)