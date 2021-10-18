FROM intersystemsdc/iris-community

RUN --mount=type=bind,src=.,dst=/tmp/redditapp/ \
  iris start iris && \
  iris session iris '##class(%ZPM.PackageManager).Shell("load /tmp/redditapp/",1,1)' && \
  iris stop IRIS quietly

RUN \
  mkdir -p /usr/irissys/demoapp/output/ && \
  touch /usr/irissys/demoapp/output/Cat.txt  \
  touch /usr/irissys/demoapp/output/Dog.txt && \
  chmod a+w /usr/irissys/demoapp/output/*
