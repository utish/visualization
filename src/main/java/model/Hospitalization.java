package model;

public class Hospitalization {
	public String numOfDays;
	public String diagnosis;
	public String program;
	public String region;
	public String numOfAdmissions;
	public String costs;

	public Hospitalization(String numOfDays, String diagnosis, String program, String region, String numOfAdmissions, String costs) {
		super();
		this.numOfDays = numOfDays;
		this.diagnosis = diagnosis;
		this.program = program;
		this.region = region;
		this.numOfAdmissions = numOfAdmissions;
		this.costs = costs;
	}

}
