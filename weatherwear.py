from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
app = Flask(__name__)

@app.route("/")
def hello():
    resp = make_response(render_template("index.html"))
    if "top_c" in request.args and "bottom_c" in request.args:
        # temp above which you don't want to wear a s/shirt
        top_c = request.args["top_c"]
        # temp below which you want something more than a s/shirt
        bottom_c = request.args["bottom_c"]
        resp.set_cookie("cutoffs", (bottom_c + "|" + top_c))
    return resp

if __name__ == "__main__":
    app.run(debug=True)


