#!/bin/bash

ls -al

npx prisma migrate deploy
npx prisma db seed