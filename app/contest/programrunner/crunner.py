from .programrunner import ProgramRunner
import subprocess

class CRunner(ProgramRunner):
  lang = "C"

  def compile(self):
    c_file = f"/tmp/submissions/{ self.submission.id }/{ self.submission.filename }"
    aout = f"/tmp/submissions/{ self.submission.id }/a.out"

    compile_proc = subprocess.run(['gcc', c_file, '-o', aout])
    
    if compile_proc.stderr:
      raise Exception('compile_error')

  def exec(self, input):
    aout = f"/tmp/submissions/{ self.submission.id }/a.out"
    return subprocess.run(
      [aout], input=input, capture_output=True, text=True
    )