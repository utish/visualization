package controller;

import java.util.List;

import model.Diagnosis;
import model.Hospitalization;
import model.Program;
import model.Region;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class GreetingController {
	
	@Autowired
	Dao dao;

	@RequestMapping("/greeting")
	public String greeting(@RequestParam(value = "name", required = false, defaultValue = "World") String name, Model model) {
		System.out.println("Hello from Controller...");
		model.addAttribute("name", name);
		return "greeting";
	}
	
	@RequestMapping("/hospitalization")
	public String hospitalization() {
		return "hospitalization";
	}
	
	@RequestMapping("/administration")
	public String administration() {
		return "administration";
	}
	
	@RequestMapping("/data") 
	@ResponseBody
	public List<Hospitalization> retrieveData() {
		return dao.retrieve();
	}
	
	@RequestMapping("/diagnosis")
	@ResponseBody
	public List<Diagnosis> retrieveDiagnosis() {
		return dao.retrieveDiagnosis();
	}
	
	@RequestMapping("/region")
	@ResponseBody
	public List<Region> retrieveRegion() {
		return dao.retrieveRegion();
	}
	
	@RequestMapping("/program")
	@ResponseBody
	public List<Program> retrieveProgram() {
		return dao.retrieveProgram();
	}

}