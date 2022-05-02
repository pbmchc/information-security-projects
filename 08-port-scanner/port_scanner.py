from common_ports import PORTS_AND_SERVICES, UNKNOWN_SERVICE
import re
from socket import error, getfqdn, gethostbyname, socket

CONNECTION_TIMEOUT = 0.25
PORT_OPEN = 0

COLUMN_HEADER_PORT = 'PORT'
COLUMN_HEADER_SERVICE = 'SERVICE'

ERROR_INVALID_HOSTNAME = 'Invalid hostname'
ERROR_INVALID_IP_ADDRESS = 'Invalid IP address'

TARGET_TYPE_IP = 'IP'
TARGET_TYPE_URL = 'URL'


def get_open_ports(target, port_range, verbose=False):
    target_type = _get_target_type(target)

    try:
        ip = gethostbyname(target)
    except error:
        return f'Error: {ERROR_INVALID_HOSTNAME if target_type == TARGET_TYPE_URL else ERROR_INVALID_IP_ADDRESS}'

    [starting_port, ending_port] = port_range
    ports = range(starting_port, ending_port + 1)
    open_ports = [port for port in ports if _is_port_open(target, port)]

    return _get_verbose_open_ports_info((ip, target, target_type), open_ports) if verbose else open_ports


def _get_target_type(target):
    return TARGET_TYPE_URL if re.search('[a-zA-Z]', target) else TARGET_TYPE_IP


def _is_port_open(target, port):
    s = socket()

    s.settimeout(CONNECTION_TIMEOUT)
    connection_result = s.connect_ex((target, port))
    s.close()

    return connection_result == PORT_OPEN


def _get_verbose_open_ports_info(host_info, open_ports):
    (ip, target, target_type) = host_info
    domain = getfqdn(ip) if target_type == TARGET_TYPE_IP else target

    title_intro = 'Open ports for '
    title_host_info = f'{domain} ({ip})' if domain != ip else ip
    table = f'\n{COLUMN_HEADER_PORT}     {COLUMN_HEADER_SERVICE}'

    for open_port in open_ports:
        port = str(open_port).ljust(len(COLUMN_HEADER_PORT))
        service = PORTS_AND_SERVICES.get(open_port, UNKNOWN_SERVICE)
        row = f'\n{port}     {service}'
        table += row

    return title_intro + title_host_info + table
