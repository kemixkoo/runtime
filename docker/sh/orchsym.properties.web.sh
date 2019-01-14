#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[ -f "${SCRIPT_DIR}/common.sh" ] && source "${SCRIPT_DIR}/common.sh"


# Site to Site properties
prop_replace 'orchsym.remote.input.host' ${RUNTIME_REMOTE_INPUT_HOST}
prop_replace 'orchsym.remote.input.secure' ${RUNTIME_SSL_ENABLED}
prop_replace 'orchsym.remote.input.socket.port' ${RUNTIME_REMOTE_INPUT_SOCKET_PORT}


# Web properties
if [[ $RUNTIME_SSL_ENABLED == 'true' ]]; then
  prop_replace 'orchsym.web.http.host' ''
  prop_replace 'orchsym.web.http.port' ''
  prop_replace 'orchsym.web.http.network.interface.default' ''
  prop_replace 'orchsym.web.https.host' ${RUNTIME_WEB_HTTPS_HOST}
  prop_replace 'orchsym.web.https.port' ${RUNTIME_WEB_HTTPS_PORT}
  prop_replace 'orchsym.web.https.network.interface.default' ''
else
  prop_replace 'orchsym.web.http.host' ${RUNTIME_WEB_HTTP_HOST}
  prop_replace 'orchsym.web.http.port' ${RUNTIME_WEB_HTTP_PORT}
  prop_replace 'orchsym.web.http.network.interface.default' ''
  prop_replace 'orchsym.web.https.host' ''
  prop_replace 'orchsym.web.https.port' ''
  prop_replace 'orchsym.web.https.network.interface.default' ''
fi
prop_replace 'orchsym.web.max.header.size' "${RUNTIME_WEB_MAX_HEADER_SIZE}"
prop_replace 'orchsym.web.proxy.context.path' ${RUNTIME_WEB_PROXY_CONTEXT_PATH}
prop_replace 'orchsym.web.proxy.host' ${RUNTIME_WEB_PROXY_HOST}


# if [ ! -z "${RUNTIME_WEB_PROXY_HOST}" ]; then
#   echo 'RUNTIME_WEB_PROXY_HOST was set but NiFi is not configured to run in a secure mode.  Will not update orchsym.web.proxy.host.'
# fi
