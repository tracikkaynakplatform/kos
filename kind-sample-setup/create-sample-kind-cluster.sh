#!/usr/bin/env bash

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

kind create cluster --config ${SCRIPT_PATH}/kind-cluster-with-extramounts.yaml
