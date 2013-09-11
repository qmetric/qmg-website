RabbitMQ install on EC2 Linux via Puppet
########################################
:date: 2012-04-12 15:46
:author: tech_ape
:category: AWS, Puppet, RabbitMQ
:slug: rabbitmq-install-on-ec2-linux-via-puppet

Installing RabbitMQ server on a 64-bit Amazon AWS Linux AMI using Puppet
was notoriously difficult to achieve, so after finally finding a stable
solution I've published this over at GitHub hoping this might save some
considerable anguish!

`https://github.com/aeells/puppet-rabbitmq-ec2-linux`_

According to the guys at RabbitMQ the install on the 64-bit EC2 Linux
AMI is not a lot of fun, largely because of the Erlang dependency.

The stability of some of the RPM providers / mirrors we were using at
one point was also quite questionable. The final solution does still
rely on some external providers, namely rabbitmq.com and
binaries.erlang-solutions.com, but we've never had an issue with the
stability of these and could arguably host the RPM ourselves anyway.

.. _`https://github.com/aeells/puppet-rabbitmq-ec2-linux`: https://github.com/aeells/puppet-rabbitmq-ec2-linux
