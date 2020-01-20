#!/bin/bash
curl "http://127.0.0.1:3000/" -X POST -d "key=MTIzNDU2Nzg=&project=example&command=example" -o /tmp/ci.log
cat /tmp/ci.log | grep "\*\*\*\*\*CI_ERR\*\*\*\*\*"
if [ $? -ne 0 ]; then
  cat /tmp/ci.log
  exit 0
else
  cat /tmp/ci.log 1>&2
  exit 1
fi