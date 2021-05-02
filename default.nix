{ pkgs ? import <nixpkgs> {}  }:

with pkgs;

let
  modules = mkYarnModules {
    name = "small-proxy-server-modules";
    pname = "small-proxy-server";
    version = "0.0.1";
    packageJSON = ./package.json;
    yarnLock = ./yarn.lock;
    yarnFlags = [
      "--offline"
      "--frozen-lockfile"
      "--ignore-engines"
    ];
  };
in stdenv.mkDerivation {
  name = "small-proxy-server";
  src = ./.;

  buildInputs = [ makeWrapper ];

  phases = ["unpackPhase" "buildPhase" "installPhase"];

  buildPhase = ''
    ln -s ${modules}/node_modules ./node_modules
    ${yarn}/bin/yarn build
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp ./dist/index.js* $out
    makeWrapper ${nodejs}/bin/node $out/bin/small-proxy-server --add-flags "$out/index.js"
    ln -s ${modules}/node_modules $out/node_modules
  '';
}
