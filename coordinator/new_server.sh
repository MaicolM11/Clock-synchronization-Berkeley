#!/bin/bash
docker run -dti --name serverdocker$1 -p $1:5000 serverlab4