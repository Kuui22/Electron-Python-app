# Electron-Python-app
 trying to mix electron and python.
 

I guess this works as a proof of concept that stuff like comfyui could be made in electron.


Currently working:

communication with python via std
 
dark - light mode switching via indexedDB variables (using dixie as manager)
 
image gallery from node folder

image generation with local model!

downloading image generation model from hf active!

you can make models from other pipelines work by converting them with this: https://raw.githubusercontent.com/huggingface/diffusers/v0.29.2/scripts/convert_original_stable_diffusion_to_diffusers.py
adding --to_safetensors in the args. (if it's a safetensor also add --from safetensors)
example command: python convert_original_stable_diffusion_to_diffusers.py --checkpoint_path ponyv6.safetensors --dump_path pony_v6/ --from_safetensors --to_safetensors

Example dashboard:
![image](https://github.com/user-attachments/assets/943c25a5-9012-417d-a070-a6e908a2bf8b)


next:

download other types of models (LLM for example)

generate using other types of models
