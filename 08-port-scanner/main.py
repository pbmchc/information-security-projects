# This entrypoint file to be used in development.
import port_scanner
from unittest import main

# URL
ports = port_scanner.get_open_ports("www.freecodecamp.org", [75, 85])
print("Open ports:", ports)

# IP
ports = port_scanner.get_open_ports("104.26.10.78", [8079, 8090])
print("Open ports:", ports)

# IP VERBOSE / NO HOSTNAME - single open port
ports = port_scanner.get_open_ports("104.26.10.78", [440, 450], True)
print(ports + '\n')

# IP VERBOSE / HOSTNAME - single open port
ports = port_scanner.get_open_ports("137.74.187.104", [440, 450], True)
print(ports + '\n')

# URL VERBOSE -- multiple open ports
ports = port_scanner.get_open_ports("scanme.nmap.org", [20, 80], True)
print(ports + '\n')

# Run unit tests automatically
main(module='test_module', exit=False)
