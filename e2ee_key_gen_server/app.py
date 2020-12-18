from flask import Flask, jsonify, request
from flask_cors import CORS

from dh import DiffieHellman

app = Flask(__name__)
cors = CORS(app)


@app.route("/generate-keys", methods=["GET"])
def generate_keys():
    dh = DiffieHellman()
    private_key, public_key = dh.get_private_key(), dh.gen_public_key()
    return jsonify({"private_key": private_key, "public_key": public_key,})


@app.route("/generate-shared-key", methods=["GET"])
def generate_shared_key():
    try:
        local_private_key = request.args.get("local_private_key")
        remote_public_key = request.args.get("remote_public_key")
    except:
        return jsonify({"message": "Invalid parameters"}), 400
    try:
        shared_key = DiffieHellman.gen_shared_key_static(
            local_private_key, remote_public_key
        )
    except:
        return jsonify({"message": "Invalid public key"}), 400
    return jsonify({"shared_key": shared_key})


if __name__ == "__main__":
    app.run()


if __name__ == "__main__":
    app.run()
