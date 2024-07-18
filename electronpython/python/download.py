import sys
from diffusers import StableDiffusionPipeline
import accelerate
import gc,os,json
import threading
import requests

directory:str = '../static'
savedir:str = ""
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
    model_path = os.path.join(cwd, 'static', name)
    if os.path.exists(model_path):
        print("Folder already exists!")
    else:
        try:
            os.mkdir(model_path)
            savedir = model_path
        except Exception as e:
            print(f"Could not create folder:{e}")


def test_link(link):
    link:str = "https://huggingface.co/api/models/"+link
    try:
        r = requests.get(link)
        if(r.status_code == 200):
            return True
        else:
            print(f"Error in request:{r.status_code}")
            return False
    except Exception as e:
        print(f"Error in request:{e}")
        return False

def download_model(link,name):
    tester = test_link(link)
    if tester:
        print(f"IM HERE: {tester}")
        pipe:StableDiffusionPipeline = StableDiffusionPipeline.from_pretrained(link)
        make_folder(name)
        pipe.save_pretrained(savedir)
        flush_pipe(pipe)
    else:
        print(f"The provided link doesn't work:{link}")

def download_worker(link,name):
    global enabled
    try:
        download_model(link,name)
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
                    enabled = False
                    thread = threading.Thread(target=download_worker, args=(link,name))
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