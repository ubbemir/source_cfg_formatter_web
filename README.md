Live version available [HERE](https://ubbemir.github.io/source_cfg_formatter_web/)

# Source CFG Formatter - Web Client

A web client for the [python source cfg](https://github.com/ubbemir/source_engine_cfg_parser) parsing/formatter library. It uses pyodide, a webassembly implementation of CPython, to enable the python library to run in the browser and therefor enable the application to be solely client sided and not in need of a backend.

The drawback of this is that it comes with an initial setup time of a couple of seconds, but nothing totally unacceptable as the page itself loads fast and informs the user of the separate initialization of the python interpreter.
