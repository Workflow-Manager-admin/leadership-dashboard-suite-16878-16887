#!/bin/bash
cd /home/kavia/workspace/code-generation/leadership-dashboard-suite-16878-16887/dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

