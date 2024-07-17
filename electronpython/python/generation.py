import sys
import json 
import gc,torch,string,random,os,asyncio
import accelerate
from diffusers import StableDiffusionPipeline
from PIL import Image
import threading
import os
#localmodel:str = "C://Users/Alessio Tammaro/Documents/GitHub/Electron-Python-app/electronpython/static/stable1-5"
localmodel:str = "/static/stable1-5"
modelurl:str = "runwayml/stable-diffusion-v1-5"
directory:str = '../images'
negativeprompt:str = "Ugly,Bad anatomy,Bad proportions,Bad quality,Blurry,Cropped,Deformed,Disconnected limbs, Out of frame,Out of focus,Dehydrated,Error, Disfigured,Disgusting, Extra arms,Extra limbs,Extra hands,Fused fingers,Gross proportions,Long neck,Low res,Low quality,Jpeg,Jpeg artifacts,Malformed limbs,Mutated ,Mutated hands,Mutated limbs,Missing arms,Missing fingers,Picture frame,Poorly drawn hands,Poorly drawn face,Text,Signature,Username,Watermark,Worst quality,Collage ,Pixel,Pixelated,Grainy "

enabled:bool = True

def send_input(input_str):
    print(f"Received from Electron: {input_str}")
    
    return "Processed in Python: " + input_str

def process_input(input_str):
    jsoninput = json.loads(input_str)
    return jsoninput

def generate_random_string(length=6):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))
def flush_pipe(pipe,image=None):
    try:
        pipe.maybe_free_model_hooks()
        del pipe
        del image
        gc.collect()
        torch.cuda.empty_cache()
        gc.collect()
    except Exception as e:
        print(f"Failed to clear: {e}")
        
def save_image(image,prompt):
    try:
        base_filename:str = f"{prompt[:10].replace(' ', '_')}"
        image_path:str = os.path.join(directory,f"{base_filename}.png").replace("\\", "/")
    
        while os.path.exists(image_path):
            random_suffix:str = generate_random_string()
            image_path = os.path.join(directory, f"{base_filename}_{random_suffix}.png").replace("\\", "/")

        image.save(image_path)
    except Exception as e:
        print(f"Error saving: {e}")
        
def generate_image(prompt,negative_prompt="",height=512,width=512,guidance_scale=7.0,num_inference_steps=35):
    try:
        pipe:StableDiffusionPipeline = StableDiffusionPipeline.from_pretrained(localmodel, torch_dtype=torch.float16, safety_checker=None)
        pipe.enable_model_cpu_offload()
    except Exception as e:
        print(f"Error setting model: {e}")
    try:
        print(f"Generating image: Prompt={prompt} \n Height/Width={height}/{width} \n Guidance scale/Steps={guidance_scale}/{num_inference_steps}" )
        image:Image = pipe(
            prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            height=height,
            width=width,
        ).images[0]   
        save_image(image,prompt)
        flush_pipe(pipe,image)
    except Exception as e:
        print(f"Error generating: {e}")


def generation_worker(prompt,negativeprompt,height,width,guidance_scale,num_inference_steps):
    global enabled
    try:
        generate_image(prompt,negativeprompt,height,width,guidance_scale,num_inference_steps)
    finally:
        enabled = True
        print("Generation done!")
        sys.stdout.flush()
        





def check_path():
    global localmodel
    global directory
    cwd = os.getcwd()
    #print(f"Current working directory: {cwd}")
    model_path = os.path.join(cwd, 'static', 'stable1-5')
    img_path = os.path.join(cwd, 'images')
    if os.path.exists(model_path):
        localmodel = model_path
        directory = img_path
    else:
        print("Model path does not exist")





if __name__ == "__main__":
    print("Python generation script started")
    check_path()
    #print(f"Model path:{localmodel}")
    #print(f"img path:{directory}")
    while True:
        try:
            line = input()
            if line:
                #result = send_input(line)
                #print(result)
                if line.startswith('{"prompt":'):
                    try:
                        jsline = process_input(line)
                        print(f"Ok! Prompt is:{jsline["prompt"]}")
                        if torch.cuda.is_available():
                            if enabled:
                                enabled= False
                                letters = generate_random_string()
                                prompt:str = jsline["prompt"]
                                height:str = jsline["height"]
                                width:str = jsline["width"]
                                guidance_scale:str = jsline["guidance"]
                                num_inference_steps:str = jsline["steps"]
                                thread = threading.Thread(target=generation_worker, args=(prompt,negativeprompt,height,width,guidance_scale,num_inference_steps))
                                thread.start()
                            else:
                                raise Exception("Still generating")
                        else:
                            raise Exception("CUDA Device not available")
                    except Exception as e:
                        print(f"Error:{e}")
                else:
                    print("Error: input is:"+line)
            else:
                break
        except EOFError:
            break
        except Exception as e:
            print(f"Error: {e}")
            break
        
        
        
