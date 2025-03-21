import datetime,time
from flask import request,jsonify
from login_api.utils.customsExceptions import *

request_counts = {}
request_wait_times = {}

async def protectOfLogin(minutes):
    if(await protect(request_counts,request_wait_times,minutes,10)==True):
            raise exceptionsAuth.onListOfAwait
            #return Errors(f"Debes esperar {minutes} minutos antes de realizar iniciar sesion"), 429
    await protectFinal(request_counts)

async def protect(request_counts,request_wait_times,minutes,max_requests):
    print(request_counts)
    ip_address = request.remote_addr
    if ip_address in request_counts and request_counts[ip_address] >= max_requests:
        # Verifica si el usuario debe esperar
        if ip_address in request_wait_times:
            wait_time = request_wait_times[ip_address]
            current_time = time.time()
            # Si el tiempo de espera ha pasado, restablece el contador y el tiempo de espera
            if current_time - wait_time >= minutes*60:
                request_counts[ip_address] = 1
                del request_wait_times[ip_address]
            else:
                return True
        else:
            # Si es la primera vez que se supera el límite, inicia el tiempo de espera
            request_wait_times[ip_address] = time.time()
            return True
        

async def protectFinal(request_counts):
    ip_address = request.remote_addr
    if ip_address in request_counts:
        request_counts[ip_address] += 1
    else:
        request_counts[ip_address] = 1

