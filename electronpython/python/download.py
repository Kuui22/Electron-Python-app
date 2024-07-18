import sys
from diffusers import StableDiffusionPipeline, DiffusionPipeline
import accelerate
import gc,os,json
import threading
import requests
import torch

directory:str = '../static'
savedir:str = ""
pipe_tag:str = ""

enabled = True

def flush_pipe(pipe,image=None):
    try:
        pipe.maybe_free_model_hooks()
        del pipe
        del image
        gc.collect()
        #torch.cuda.empty_cache()
        gc.collect()
    except Exception as e:
        print(f"Failed to clear: {e}")

def check_path():
    global directory
    cwd = os.getcwd()
    #print(f"Current working directory: {cwd}")
    model_path = os.path.join(cwd, 'static')
    if os.path.exists(model_path):
        directory = model_path
    else:
        try:
            os.mkdir(model_path)
            directory = model_path
        except Exception as e:
            print(f"Could not create folder:{e}")

def make_folder(name):
    global savedir
    cwd = os.getcwd()
    model_path = os.path.join(cwd, 'static', pipe_tag, name)
    if os.path.exists(model_path):
        print("Folder already exists!")
        return False
    else:
        try:
            os.mkdir(model_path)
            savedir = model_path
        except Exception as e:
            print(f"Could not create folder:{e}")
            return False
        finally:
            return True


def test_link(link):
    global pipe_tag
    link:str = "https://huggingface.co/api/models/"+link
    try:
        r = requests.get(link)
        if(r.status_code == 200):
            data = r.json()
            pipe_tag = data["pipeline_tag"]
            print(f"Pipeline tag:{pipe_tag}")
            return True
        else:
            print(f"Error in request:{r.status_code}")
            return False
    except Exception as e:
        print(f"Error in request:{e}")
        return False

def download_model(link,name,pipetype):
    tester = test_link(link)
    if tester:
        if(pipetype=='StableDiffusionPipeline'):
            if make_folder(name):
                pipe:StableDiffusionPipeline = StableDiffusionPipeline.from_pretrained(link, torch_dtype=torch.float16, use_safetensors=True)
                pipe.save_pretrained(savedir)
                flush_pipe(pipe)
        elif(pipetype=='DiffusionPipeline'):
            if make_folder(name):
                pipe:DiffusionPipeline = DiffusionPipeline.from_pretrained(link, torch_dtype=torch.float16, use_safetensors=True)
                pipe.save_pretrained(savedir)
                flush_pipe(pipe)
        else:
                print(f"The provided pipe type is not supported:{pipetype}")

            
    else:
        print(f"The provided link doesn't work:{link}")

def download_worker(link,name,pipetype):
    global enabled
    try:
        download_model(link,name,pipetype)
    finally:
        enabled = True
        print("Download complete!")
        sys.stdout.flush()
def process_input(input_str):
    jsoninput = json.loads(input_str)
    return jsoninput

if __name__ == "__main__":
    print("Python download script started")
    check_path()
    #print(f"Model path:{localmodel}")
    #print(f"img path:{directory}")
    while True:
        try:
            line = input()
            if line:
                if enabled:
                    jsline = process_input(line)
                    name:str = jsline["name"]
                    link:str = jsline["link"]
                    pipetype:str = jsline["pipe"]
                    enabled = False
                    thread = threading.Thread(target=download_worker, args=(link,name,pipetype))
                    thread.start()
                else:
                    print("I'm already downloading a model!")
                    sys.stdout.flush()
            else:
                break
        except EOFError:
            break
        except Exception as e:
            print(f"Error: {e}")
            break