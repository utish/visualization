package controller;

import java.util.List;

import model.Diagnosis;
import model.Hospitalization;
import model.Program;
import model.Region;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


@Service
public class Dao {
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	

	public List<Hospitalization> retrieve() {
		return jdbcTemplate.query("select * from hospitalization", (rs, rowNum) -> new Hospitalization(
				rs.getString("numOfDays"),
				rs.getString("diagnosis"),
				rs.getString("program"),
				rs.getString("region"),
				rs.getString("numOfAdmissions"),
				rs.getString("costs")
				));
		
	}
	
	public List<Diagnosis> retrieveDiagnosis() {
		return jdbcTemplate.query("select * from diagnosis", (rs, rowNum) -> new Diagnosis(
				rs.getString("code"),
				rs.getString("description")));
	}
	
	public List<Region> retrieveRegion() {
		return jdbcTemplate.query("select * from region", (rs, rowNum) -> new Region(
				rs.getString("code"),
				rs.getString("description")));
	}
	
	public List<Program> retrieveProgram() {
		return jdbcTemplate.query("select * from program", (rs, rowNum) -> new Program(
				rs.getString("code"),
				rs.getString("description")));
	}	
}
