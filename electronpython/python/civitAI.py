import sys
from diffusers import StableDiffusionPipeline, DiffusionPipeline
import accelerate
import gc,os,json
import threading
import requests
import torch


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
            
def process_input(input_str):
    jsoninput = json.loads(input_str)
    return jsoninput
def test_link(link):
    global pipe_tag
    #– /api/download/models/12345?type=Model&format=SafeTensor&size=pruned&fp=fp16&token=YOUR_TOKEN_HERE
    link:str = "https://civitai.com/api/download/models/"+link+"?type=Model&format=SafeTensor&size=pruned&fp=fp16"
    try:
        r = requests.get(link)
        if(r.status_code == 200):
            data = r.json()
            pipe_tag = data["pipeline_tag"]
            print(f"Pipeline tag:{pipe_tag}")
            if(data['tags']):
                for key in data['tags']:
                    if key == 'lora' or key == 'template:sd-lora':
                        raise Exception('LORA are not supported!')
            return True
        else:
            print(f"Error in request:{r.status_code}")
            return False
    except Exception as e:
        print(f"Error in request:{e}")
        return False

def download_model(link,name,modeltype):
    tester = test_link(link)



def download_worker(link,name,modeltype):
    global enabled
    try:
        download_model(link,name,modeltype)
    finally:
        enabled = True
        print("Download complete!")
        sys.stdout.flush()


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
                    modeltype:str = jsline["type"]
                    enabled = False
                    thread = threading.Thread(target=download_worker, args=(link,name,modeltype))
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