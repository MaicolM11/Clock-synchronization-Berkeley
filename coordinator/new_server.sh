#!/bin/bash
docker run -dti --name serverdocker$1 -p $1:3000 serverlab4