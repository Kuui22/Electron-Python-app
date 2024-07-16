import sys

def process_input(input_str):
    print(f"Received from Electron: {input_str}")
    # Add your processing logic here
    # For example, you can return a string
    return "Processed in Python: " + input_str

if __name__ == "__main__":
    print("Python script started")
    while True:
        try:
            line = input()
            if line:
                result = process_input(line)
                print(result)
            else:
                break
        except EOFError:
            break
        except Exception as e:
            print(f"Error: {e}")
            break