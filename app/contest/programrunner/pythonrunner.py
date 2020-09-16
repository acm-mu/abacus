from .programrunner import ProgramRunner
import subprocess

class PythonRunner(ProgramRunner):
  lang = "Python 3"

  def exec(self, input):
    py_file = f"/tmp/submissions/{ self.submission.id }/{ self.submission.filename }"
    return subprocess.run(
      ["python3", py_file], input=input, capture_output=True, text=True
    )