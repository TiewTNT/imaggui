api:
	python backend/run.py
all:
	cd frontend; npm run build; cd ..; python backend/run.py