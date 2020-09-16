from time import time

class ProgramRunner:
  lang = None

  def __init__(self, submission):
    self.submission = submission

  def compile(self):
    pass

  def exec(self, input):
    pass

  def run_test(self, test):
    infile = open(test['in_file'])
    outfile = open(test['ans_file'])

    start = time() * 1000
    res = self.exec(infile.read())
    end = time() * 1000

    if end - start > self.submission.runtime:
      self.submission.runtime = end - start

    print(f'stdout: {res.stdout}')

    if res.stderr:
      test['status'] = 'run_time_error'
    elif res.stdout.rstrip() == outfile.read().rstrip():
      test['status'] = 'accepted'
    else:
      test['status'] = 'wrong_answer'

    infile.close()
    outfile.close()

    return test['status']

  def run(self):
    self.submission.runtime = 0
    try:
      self.compile()
    except Exception:
      self.submission.status = 'wrong_answer'
      print(f"[ProgramRunner] Failed to compile '{self.submission.filename}'", flush=True)
      return

    all_passed = True
    print(f"[ProgramRunner] Running {len(self.submission.tests)} for '{self.submission.id}'", flush=True)
    for test in self.submission.tests:
      status = self.run_test(test)

      if status in ['run_time_error', 'timeout_error']:
        self.submission.status = status
        return
      elif status == "wrong_answer":
        all_passed = False
    
    self.submission.status = "accepted" if all_passed else "wrong_answer"