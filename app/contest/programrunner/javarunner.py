from .programrunner import ProgramRunner
import subprocess

class JavaRunner(ProgramRunner):
  lang = "Java"

  def compile(self):
    java_file = f"/tmp/submissions/{self.submission.id}/{self.submission.filename}"
    
    compile_proc = subprocess.run(['javac', java_file])
    
    if compile_proc.stderr:
      raise Exception('compile_error')
  
  def exec(self, input):
    cp = f"/tmp/submissions/{self.submission.id}"
    classfile = self.submission.filename[:-5] # Cut off .class

    return subprocess.run(
      ['java', '-cp', cp, classfile], input=input, capture_output=True, text=True
    )