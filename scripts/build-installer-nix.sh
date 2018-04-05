#!/usr/bin/env bash

set -ex

VERSION=$1
BUILDKITE_BUILD_NUMBER=$2

rm -rf dist || true

echo '~~~ Pre-building node_modules with nix'
nix-build default.nix -A rawapp.deps -o node_modules.root -Q

echo '~~~ Building mainnet installer'
nix-build release.nix -A mainnet.installer --argstr buildNr $BUILDKITE_BUILD_NUMBER --argstr version $VERSION
if [ -n "${BUILDKITE_JOB_ID:-}" ]; then
  buildkite-agent artifact upload result/Daedalus*installer*.bin --job $BUILDKITE_JOB_ID
fi

echo '~~~ Building staging installer'
nix-build release.nix -A staging.installer --argstr buildNr $BUILDKITE_BUILD_NUMBER --argstr version $VERSION
if [ -n "${BUILDKITE_JOB_ID:-}" ]; then
  buildkite-agent artifact upload result/Daedalus*installer*.bin --job $BUILDKITE_JOB_ID
fi