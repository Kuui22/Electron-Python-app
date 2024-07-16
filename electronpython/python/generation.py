import sys

def send_input(input_str):
    print(f"Received from Electron: {input_str}")
    
    return "Processed in Python: " + input_str

def process_input(input_str):
    x = 0
    return



if __name__ == "__main__":
    print("Python script started")
    while True:
        try:
            line = input()
            if line:
                #result = send_input(line)
                #print(result)
                if(line.startswith('{"prompt":')):
                    process_input(line)
                    print(f"Ok!:{line}")
                else:
                    print("Error: input is:"+line)
            else:
                break
        except EOFError:
            break
        except Exception as e:
            print(f"Error: {e}")
            break