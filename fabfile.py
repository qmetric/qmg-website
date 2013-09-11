from fabric.api import task
from qmgdevops.deploy import fabric
from qmgdevops.deploy.fabric.scripts import StartService, StopService

@task
def deploy(stack, version=None):
    """ Deploy this service to all hosts in a specified stack. For example fab deploy:demo will deploy to the demo stack."""
    """ Destination directories MUST end with a trailing slash, otherwise fabric gives 'file not found"""
    files = [('qmetric', '/var/www/html/'),
    ]
    service = 'httpd'

    fabric.deploy_app(stack=stack, artifact="qmgwebsite", files=files, version=version, before=StopService(service), after=StartService(service))
