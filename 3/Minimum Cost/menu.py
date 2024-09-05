import tkinter as tk
import webbrowser

def open_html_game(url):
    webbrowser.open(url)

def launch_tkinter_game(game):
    if game == "Game1":
        import Minimum_cost  
    elif game == "Game2":
        import game2  

# Main window
root = tk.Tk()
root.title("Game Menu")
root.geometry("600x500")  
root.configure(bg="#f0f8ff")  


title_label = tk.Label(root, text="Game Menu", font=("Helvetica", 28, "bold"), bg="#f0f8ff", fg="#333333")
title_label.pack(pady=30)

def create_button(parent, text, command, bg_color, fg_color):
    button = tk.Button(parent, text=text, font=("Helvetica", 16), bg=bg_color, fg=fg_color, command=command,
                       relief="flat", bd=0, padx=20, pady=10, borderwidth=1, highlightthickness=0)
    button.pack(pady=10, padx=30, fill='x')
    return button

# Buttons for Tkinter games
tkinter_game1_button = create_button(root, "Minimum Cost", lambda: launch_tkinter_game("Game1"), "#4CAF50", "white")
tkinter_game2_button = create_button(root, "Identify Shortest Path", lambda: launch_tkinter_game("Game2"), "#4CAF50", "white")

# Buttons for HTML games
html_game1_button = create_button(root, "Sixteen Queens", lambda: open_html_game("http://example.com/game1"), "#2196F3", "white")
html_game2_button = create_button(root, "Tower of Hanoi", lambda: open_html_game("http://example.com/game2"), "#2196F3", "white")
html_game3_button = create_button(root, "Predict the Value Index", lambda: open_html_game("http://example.com/game3"), "#2196F3", "white")

root.mainloop()
